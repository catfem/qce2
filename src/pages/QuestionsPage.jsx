import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import Papa from 'papaparse';
import { FileDropzone } from '../components/Questions/FileDropzone.jsx';
import { QuestionFilters } from '../components/Questions/QuestionFilters.jsx';
import { QuestionTable } from '../components/Questions/QuestionTable.jsx';
import { QuestionReviewModal } from '../components/Questions/QuestionReviewModal.jsx';
import { QuestionEditorModal } from '../components/Questions/QuestionEditorModal.jsx';
import { QuestionSetManager } from '../components/Questions/QuestionSetManager.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useCredits } from '../context/CreditContext.jsx';
import {
  batchUploadQuestions,
  createQuestionSet,
  deleteQuestion,
  duplicateQuestionSet,
  exportQuestionSet,
  fetchQuestionList,
  fetchQuestionSets,
  mergeQuestionSets,
  shareQuestionSet,
  updateQuestion
} from '../services/questions.js';
import { uploadToStorage } from '../services/storage.js';
import { extractQuestionsFromAI } from '../services/ai.js';
import { ROLES } from '../utils/constants.js';
import { Button } from '../components/ui/Button.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';

export default function QuestionsPage() {
  const { user, accessToken, role } = useUser();
  const { fetchCredits } = useCredits();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState({
    search: '',
    tags: [],
    onlyPrivate: false,
    difficulty: null,
    category: null
  });
  const [processing, setProcessing] = useState({ active: false, progress: 0 });
  const [reviewPayload, setReviewPayload] = useState(null);
  const [editorQuestion, setEditorQuestion] = useState(null);

  const isModerator = useMemo(() => role === ROLES.moderator || role === ROLES.admin, [role]);

  const { data: questionList, isLoading } = useQuery({
    queryKey: ['questions', filters],
    queryFn: () => fetchQuestionList(accessToken, filters),
    enabled: Boolean(accessToken)
  });

  const { data: questionSets } = useQuery({
    queryKey: ['question-sets'],
    queryFn: () => fetchQuestionSets(accessToken),
    enabled: Boolean(accessToken)
  });

  const uploadMutation = useMutation({
    mutationFn: (payload) => batchUploadQuestions(accessToken, payload),
    onSuccess: async () => {
      toast.success('Questions saved to bank');
      setReviewPayload(null);
      await Promise.all([
        queryClient.invalidateQueries(['questions']),
        queryClient.invalidateQueries(['dashboard-overview']),
        queryClient.invalidateQueries(['question-sets'])
      ]);
      fetchCredits();
    },
    onError: (error) => toast.error('Failed to save questions', { description: error.message })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => updateQuestion(accessToken, id, payload),
    onSuccess: async () => {
      toast.success('Question updated');
      setEditorQuestion(null);
      await Promise.all([queryClient.invalidateQueries(['questions']), queryClient.invalidateQueries(['dashboard-overview'])]);
    },
    onError: (error) => toast.error('Failed to update question', { description: error.message })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteQuestion(accessToken, id),
    onSuccess: async () => {
      toast.success('Question removed');
      await Promise.all([queryClient.invalidateQueries(['questions']), queryClient.invalidateQueries(['dashboard-overview'])]);
    },
    onError: (error) => toast.error('Failed to remove question', { description: error.message })
  });

  const createSetMutation = useMutation({
    mutationFn: (payload) => createQuestionSet(accessToken, payload),
    onSuccess: async () => {
      toast.success('Question set created');
      await queryClient.invalidateQueries(['question-sets']);
    },
    onError: (error) => toast.error('Unable to create set', { description: error.message })
  });

  const mergeMutation = useMutation({
    mutationFn: (payload) => mergeQuestionSets(accessToken, payload),
    onSuccess: async () => {
      toast.success('Question sets merged');
      await Promise.all([queryClient.invalidateQueries(['question-sets']), queryClient.invalidateQueries(['questions'])]);
    },
    onError: (error) => toast.error('Unable to merge sets', { description: error.message })
  });

  const duplicateMutation = useMutation({
    mutationFn: (payload) => duplicateQuestionSet(accessToken, payload),
    onSuccess: async () => {
      toast.success('Question set duplicated');
      await queryClient.invalidateQueries(['question-sets']);
    },
    onError: (error) => toast.error('Unable to duplicate set', { description: error.message })
  });

  const shareMutation = useMutation({
    mutationFn: (payload) => shareQuestionSet(accessToken, payload),
    onSuccess: () => toast.success('Question set shared'),
    onError: (error) => toast.error('Failed to share set', { description: error.message })
  });

  const exportMutation = useMutation({
    mutationFn: (payload) => exportQuestionSet(accessToken, payload),
    onSuccess: async (data, variables) => {
      await downloadExport(variables.format, data.set, data.questions);
      toast.success('Export ready');
    },
    onError: (error) => toast.error('Export failed', { description: error.message })
  });

  const handleUpload = async (files) => {
    if (!user) return;
    setProcessing({ active: true, progress: 10 });
    try {
      const aggregatedQuestions = [];
      const nameParts = [];
      let privateFlag = false;

      for (const [index, file] of files.entries()) {
        setProcessing({ active: true, progress: Math.round((index / files.length) * 80) });
        const uploadResult = await uploadToStorage(file, user.id);
        setProcessing({ active: true, progress: 85 });
        const extraction = await extractQuestionsFromAI(accessToken, {
          filePath: uploadResult.path,
          fileName: file.name,
          fileSize: file.size,
          signedUrl: uploadResult.signedUrl
        });
        setProcessing({ active: true, progress: 95 });

        if (Array.isArray(extraction.questions) && extraction.questions.length > 0) {
          aggregatedQuestions.push(...extraction.questions);
          if (extraction.metadata?.suggestedSetName) {
            nameParts.push(extraction.metadata.suggestedSetName);
          } else {
            nameParts.push(file.name.replace(/\.[^/.]+$/, ''));
          }
          if (extraction.metadata?.isPrivate) {
            privateFlag = true;
          }
        }
      }

      if (aggregatedQuestions.length === 0) {
        toast.warning('No questions were returned from the selected files.');
        setProcessing({ active: false, progress: 0 });
        return;
      }

      setReviewPayload({
        questions: aggregatedQuestions,
        metadata: {
          suggestedSetName: nameParts.length > 1 ? `${nameParts[0]} + ${nameParts.length - 1} more` : nameParts[0],
          isPrivate: privateFlag
        }
      });
      await fetchCredits();
      setProcessing({ active: false, progress: 100 });
    } catch (error) {
      toast.error('AI extraction failed', { description: error.message });
      setProcessing({ active: false, progress: 0 });
    }
  };

  const handleSaveExtracted = (payload) => {
    uploadMutation.mutate({
      questions: payload.questions,
      metadata: payload.meta
    });
  };

  const handleEditSubmit = (draft) => {
    updateMutation.mutate({ id: draft.id, payload: draft });
  };

  const handleDelete = (question) => {
    deleteMutation.mutate(question.id);
  };

  const handleTogglePrivacy = (question) => {
    updateMutation.mutate({
      id: question.id,
      payload: {
        is_private: !question.is_private
      }
    });
  };

  const handleCreateSet = (payload) => createSetMutation.mutate(payload);
  const handleMergeSets = (payload) => mergeMutation.mutate(payload);
  const handleDuplicateSet = (payload) => duplicateMutation.mutate(payload);
  const handleShareSet = (payload) => shareMutation.mutate(payload);
  const handleExportSet = (payload) => exportMutation.mutate(payload);

  const questions = questionList?.items || [];
  const sets = questionSets?.items || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-20" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-3xl font-semibold text-gradient">Question bank</h2>
        <p className="text-sm text-slate-300">
          Manage question sets, launch AI extraction workflows, and control visibility across private and open libraries.
        </p>
      </section>
      <FileDropzone onDrop={handleUpload} isProcessing={processing.active} progress={processing.progress} />
      <QuestionFilters filters={filters} onChange={setFilters} />
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setFilters({ ...filters, onlyPrivate: !filters.onlyPrivate })}>
          {filters.onlyPrivate ? 'View all questions' : 'View private only'}
        </Button>
      </div>
      <QuestionTable
        questions={questions}
        onEdit={setEditorQuestion}
        onDelete={handleDelete}
        onTogglePrivacy={handleTogglePrivacy}
        isModerator={isModerator}
      />
      <QuestionSetManager
        sets={sets}
        onCreate={handleCreateSet}
        onMerge={handleMergeSets}
        onDuplicate={handleDuplicateSet}
        onExport={handleExportSet}
        onShare={handleShareSet}
        isModerator={isModerator}
      />
      <QuestionReviewModal open={Boolean(reviewPayload)} data={reviewPayload} onClose={() => setReviewPayload(null)} onSave={handleSaveExtracted} />
      <QuestionEditorModal open={Boolean(editorQuestion)} question={editorQuestion} onClose={() => setEditorQuestion(null)} onSubmit={handleEditSubmit} />
    </div>
  );
}

function buildCsv(set, questions) {
  const rows = questions.map((question) => ({
    set: set.name,
    title: question.title,
    body: question.body,
    difficulty: question.difficulty,
    category: question.category,
    tags: (question.tags || []).join('|'),
    answer: question.answer,
    explanation: question.explanation
  }));
  return Papa.unparse(rows);
}

function buildPdfArrayBuffer(set, questions) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.text(set.name, 40, 60);
  let y = 90;
  doc.setFontSize(12);
  questions.forEach((question, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${question.title}`, 500);
    if (y + lines.length * 16 > 780) {
      doc.addPage();
      y = 80;
    }
    doc.text(lines, 40, y);
    y += lines.length * 16;
    const bodyLines = doc.splitTextToSize(question.body, 500);
    doc.text(bodyLines, 40, y);
    y += bodyLines.length * 14 + 10;
    if (question.options) {
      question.options.forEach((option) => {
        const optionLines = doc.splitTextToSize(`- ${option.value}${option.isCorrect ? ' (correct)' : ''}`, 460);
        doc.text(optionLines, 60, y);
        y += optionLines.length * 12;
      });
    }
    y += 10;
  });
  return doc.output('arraybuffer');
}

async function buildDocxBlob(set, questions) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: set.name, heading: HeadingLevel.TITLE }),
          ...questions.flatMap((question, index) => [
            new Paragraph({ text: `${index + 1}. ${question.title}`, heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: question.body }),
            ...(question.options || []).map(
              (option) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: option.isCorrect ? '✓ ' : '• ', bold: option.isCorrect }),
                    new TextRun(option.value)
                  ]
                })
            ),
            new Paragraph({ text: `Answer: ${question.answer || 'N/A'}` }),
            new Paragraph({ text: `Explanation: ${question.explanation || 'N/A'}` })
          ])
        ]
      }
    ]
  });

  return Packer.toBlob(doc);
}

async function downloadExport(format, set, questions) {
  if (format === 'csv') {
    const csv = buildCsv(set, questions);
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, `${set.name}.csv`);
    return;
  }
  if (format === 'pdf') {
    const arrayBuffer = buildPdfArrayBuffer(set, questions);
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    saveAs(blob, `${set.name}.pdf`);
    return;
  }
  const blob = await buildDocxBlob(set, questions);
  saveAs(blob, `${set.name}.docx`);
}

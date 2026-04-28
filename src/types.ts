export interface Section {
  id: string;
  label: string;
  text: string;
  pending: boolean;
  active?: boolean;
  locked?: boolean;
  removed?: boolean;
  removing?: boolean;
  displayedText?: string;  // for typewriter animation — grows char by char
  oldText?: string;        // previous text shown during transition (strikethrough)
}

export interface TranscriptWord {
  text: string;
  active: boolean;
}

export interface TranscriptBlock {
  id: string;
  words: TranscriptWord[];
  done: boolean;
  unprocessed?: boolean;  // for real speech (not demo)
  rawText?: string;       // for real speech
}

export interface DictationStep {
  target: string;
  transcript: string;
  newText: string;
  showLockToast?: boolean;
  removeTargets?: string[];
}

export interface PatientInfo {
  name: string;
  pesel: string;
  examType: string;
}

export interface AppState {
  currentView: 'list' | 'workspace';
  sections: Section[];
  isRecording: boolean;
  storyRunning: boolean;
  storyDone: boolean;
  manualStop: boolean;
  toastMessage: string | null;
  saveStatus: 'idle' | 'saving' | 'saved';
  modalOpen: boolean;
  patientInfo: PatientInfo;
  exportsEnabled: boolean;
  transcriptBlocks: TranscriptBlock[];
  micStatusText: string;
}

export type AppAction =
  | { type: 'SET_VIEW'; view: 'list' | 'workspace' }
  | { type: 'INIT_WORKSPACE' }
  | { type: 'UPDATE_SECTION_TEXT'; id: string; text: string }
  | { type: 'LOCK_SECTION'; id: string; text: string }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'SET_SECTION_REMOVING'; id: string }
  | { type: 'SET_ACTIVE_SECTION'; id: string }
  | { type: 'CLEAR_ACTIVE' }
  | { type: 'SET_RECORDING'; value: boolean }
  | { type: 'SET_STORY_STATE'; running: boolean; done: boolean; manualStop?: boolean }
  | { type: 'ADD_TRANSCRIPT_BLOCK'; id: string }
  | { type: 'APPEND_TRANSCRIPT_WORD'; blockId: string; word: string }
  | { type: 'FINISH_TRANSCRIPT_BLOCK'; blockId: string }
  | { type: 'CLEAR_TRANSCRIPT' }
  | { type: 'SET_DISPLAYED_TEXT'; id: string; text: string }
  | { type: 'SET_MIC_STATUS'; text: string }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_SAVE_STATUS'; status: 'idle' | 'saving' | 'saved' }
  | { type: 'TOGGLE_MODAL'; open: boolean }
  | { type: 'SET_PATIENT_INFO'; info: PatientInfo }
  | { type: 'ENABLE_EXPORTS' };

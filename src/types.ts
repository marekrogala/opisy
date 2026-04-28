export interface Section {
  id: string;
  label: string;
  text: string;
  pending: boolean;
  active?: boolean;
  locked?: boolean;
  removed?: boolean;
}

export interface TranscriptBlock {
  id: string;
  words: string[];
  done: boolean;
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
}

export type AppAction =
  | { type: 'SET_VIEW'; view: 'list' | 'workspace' }
  | { type: 'INIT_WORKSPACE' }
  | { type: 'UPDATE_SECTION_TEXT'; id: string; text: string }
  | { type: 'LOCK_SECTION'; id: string; text: string }
  | { type: 'REMOVE_SECTION'; id: string }
  | { type: 'SET_ACTIVE_SECTION'; id: string }
  | { type: 'CLEAR_ACTIVE' }
  | { type: 'SET_RECORDING'; value: boolean }
  | { type: 'SET_STORY_STATE'; running: boolean; done: boolean; manualStop?: boolean }
  | { type: 'ADD_TRANSCRIPT_BLOCK'; block: TranscriptBlock }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_SAVE_STATUS'; status: 'idle' | 'saving' | 'saved' }
  | { type: 'TOGGLE_MODAL'; open: boolean }
  | { type: 'SET_PATIENT_INFO'; info: PatientInfo }
  | { type: 'ENABLE_EXPORTS' };

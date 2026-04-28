import type { AppState, AppAction } from '../types';
import { clone } from '../utils/helpers';
import { MASTER_TEMPLATE } from '../data/template';

export const initialState: AppState = {
  currentView: 'list',
  sections: clone(MASTER_TEMPLATE.sections),
  isRecording: false,
  storyRunning: false,
  storyDone: false,
  manualStop: false,
  toastMessage: null,
  saveStatus: 'idle',
  modalOpen: false,
  patientInfo: {
    name: 'Anna Kowalska',
    pesel: '84062512345',
    examType: 'MR kolana prawego',
  },
  exportsEnabled: false,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.view };

    case 'INIT_WORKSPACE':
      return {
        ...state,
        sections: clone(MASTER_TEMPLATE.sections),
        isRecording: false,
        storyRunning: false,
        storyDone: false,
        manualStop: false,
        saveStatus: 'idle',
        exportsEnabled: false,
      };

    case 'UPDATE_SECTION_TEXT':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.id ? { ...s, text: action.text } : s
        ),
      };

    case 'LOCK_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.id
            ? { ...s, text: action.text, active: false, pending: false, locked: true }
            : s
        ),
      };

    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.id === action.id ? { ...s, removed: true } : s
        ),
      };

    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s => ({
          ...s,
          active: s.id === action.id,
        })),
      };

    case 'CLEAR_ACTIVE':
      return {
        ...state,
        sections: state.sections.map(s => ({ ...s, active: false })),
      };

    case 'SET_RECORDING':
      return { ...state, isRecording: action.value };

    case 'SET_STORY_STATE':
      return {
        ...state,
        storyRunning: action.running,
        storyDone: action.done,
        manualStop: action.manualStop ?? state.manualStop,
      };

    case 'ADD_TRANSCRIPT_BLOCK':
      return state; // transcript is handled by DOM directly

    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.message };

    case 'HIDE_TOAST':
      return { ...state, toastMessage: null };

    case 'SET_SAVE_STATUS':
      return { ...state, saveStatus: action.status };

    case 'TOGGLE_MODAL':
      return { ...state, modalOpen: action.open };

    case 'SET_PATIENT_INFO':
      return { ...state, patientInfo: action.info };

    case 'ENABLE_EXPORTS':
      return { ...state, exportsEnabled: true };

    default:
      return state;
  }
}

import { useReducer, useCallback, useState } from 'react';
import { appReducer, initialState } from './state/reducer';
import { ListView } from './components/ListView/ListView';
import { WorkspaceView } from './components/Workspace/WorkspaceView';
import { Toast } from './components/Toast';

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [autoDemo, setAutoDemo] = useState(false);

  const handleOpenWorkspace = useCallback((runDemo = false) => {
    setAutoDemo(runDemo);
    dispatch({ type: 'INIT_WORKSPACE' });
    dispatch({ type: 'SET_VIEW', view: 'workspace' });
  }, []);

  const handleNewExam = useCallback(() => {
    dispatch({ type: 'SET_PATIENT_INFO', info: { name: '', pesel: '', examType: 'MR kolana prawego' } });
    handleOpenWorkspace(false);
  }, [handleOpenWorkspace]);

  const handleShowToast = useCallback((msg: string) => {
    dispatch({ type: 'SHOW_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2600);
  }, []);

  return (
    <div className="app">
      {state.currentView === 'list' && (
        <ListView
          dispatch={dispatch}
          onOpenWorkspace={() => handleOpenWorkspace(true)}
          onNewExam={handleNewExam}
        />
      )}
      {state.currentView === 'workspace' && (
        <WorkspaceView
          key={Date.now()}
          state={state}
          dispatch={dispatch}
          onShowToast={handleShowToast}
          autoDemo={autoDemo}
        />
      )}
      <Toast message={state.toastMessage} />
    </div>
  );
}

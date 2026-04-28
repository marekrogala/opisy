import { useReducer, useCallback } from 'react';
import { appReducer, initialState } from './state/reducer';
import { ListView } from './components/ListView/ListView';
import { WorkspaceView } from './components/Workspace/WorkspaceView';
import { Toast } from './components/Toast';

export function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleOpenWorkspace = useCallback(() => {
    dispatch({ type: 'INIT_WORKSPACE' });
    dispatch({ type: 'SET_VIEW', view: 'workspace' });
  }, []);

  const handleShowToast = useCallback((msg: string) => {
    dispatch({ type: 'SHOW_TOAST', message: msg });
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 2600);
  }, []);

  return (
    <div className="app">
      {state.currentView === 'list' && (
        <ListView
          dispatch={dispatch}
          modalOpen={state.modalOpen}
          onOpenWorkspace={handleOpenWorkspace}
        />
      )}
      {state.currentView === 'workspace' && (
        <WorkspaceView
          key={state.currentView} // remount when switching back
          state={state}
          dispatch={dispatch}
          onShowToast={handleShowToast}
        />
      )}
      <Toast message={state.toastMessage} />
    </div>
  );
}

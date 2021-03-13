import './App.css';
import Zipper from './Zipper/Zipper'
import ErrorBoundary from './utils/ErrorBoundary'
function App() {
  return (
    <ErrorBoundary>
      <Zipper />
    </ErrorBoundary>
  );
}

export default App;

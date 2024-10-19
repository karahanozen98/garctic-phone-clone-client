import Home from "./Home";
import { PageWrapper } from "./components/PageWrapper";

function App() {
  return (
    <PageWrapper isPrivate={true}>
      <div className="login">
        <Home />
      </div>
    </PageWrapper>
  );
}

export default App;

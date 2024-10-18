import Card from "../../components/Card";
import { PageWrapper } from "../../components/PageWrapper";

export default function NotFound() {
  return (
    <PageWrapper>
      <Card>
        <h1>404 - Page Not Found</h1>
        <p>
          Sorry, the page you are looking for does not exist. You might have
          typed the wrong URL or the page has been moved.
        </p>
        <a href="/">Go back to the homepage</a>
      </Card>
    </PageWrapper>
  );
}

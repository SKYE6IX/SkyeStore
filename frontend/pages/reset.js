import PasswordRequest from "../components/PasswordRequest";
import Reset from "../components/Reset";

export default function ResetPage({ query }) {
  if (!query.token) {
    return <PasswordRequest />;
  }
  return (
    <div>
      <Reset token={query.token}/>
    </div>
  );
}

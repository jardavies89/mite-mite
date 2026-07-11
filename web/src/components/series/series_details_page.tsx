import { useParams } from "react-router-dom";

function SeriesDetailsPage() {
  const { franchiseId } = useParams();

  console.log(franchiseId);

  return <div />;
}

export { SeriesDetailsPage };

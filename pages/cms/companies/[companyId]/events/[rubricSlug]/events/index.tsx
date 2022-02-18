import { getRubricEventsListSsr } from 'db/ssr/events/getRubricEventsListSsr';
import CmsRubricEventsPage from './[...filters]';

export const getServerSideProps = getRubricEventsListSsr;
export default CmsRubricEventsPage;

import { getConsoleRubricEventsListSsr } from 'db/ssr/events/getConsoleRubricEventsListSsr';
import CmsRubricEventsPage from './[...filters]';

export const getServerSideProps = getConsoleRubricEventsListSsr;
export default CmsRubricEventsPage;

import React from 'react';
import AppLayout from '../AppLayout/AppLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from '../../routes/NotFound/NotFound';
import RubricVariantsRoute from '../../routes/RubricVariants/RubricVariantsRoute';
import OptionsGroupsRoute from '../../routes/OptionsGroups/OptionsGroupsRoute';
import AttributesGroupsRoute from '../../routes/AttributesGroups/AttributesGroupsRoute';
import RubricsRoute from '../../routes/Rubrics/RubricsRoute';

function App() {
  return (
    <Router>
      <Routes basename={'/app'}>
        <Route path={'/'} element={<AppLayout />}>
          <Route path={'orders'} element={<div>Orders</div>} />
          <Route path={'profile'} element={<div>Profile</div>} />

          {/*CMS*/}
          <Route path={'rubrics'} element={<RubricsRoute />} />
          <Route path={'products'} element={<div>Products</div>} />
          <Route path={'rubric-variants'} element={<RubricVariantsRoute />} />
          <Route path={'attributes-groups'} element={<AttributesGroupsRoute />} />
          <Route path={'options-groups'} element={<OptionsGroupsRoute />} />

          {/*404*/}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

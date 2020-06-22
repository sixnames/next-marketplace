import React from 'react';
import AppLayout from '../AppLayout/AppLayout';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import NotFound from '../../routes/NotFound/NotFound';
import RubricVariantsRoute from '../../routes/RubricVariants/RubricVariantsRoute';
import OptionsGroupsRoute from '../../routes/OptionsGroups/OptionsGroupsRoute';
import AttributesGroupsRoute from '../../routes/AttributesGroups/AttributesGroupsRoute';
import RubricsRoute from '../../routes/Rubrics/RubricsRoute';
import ProductsRoute from '../../routes/Products/ProductsRoute';

function App() {
  return (
    <Router>
      <Routes basename={'/app'}>
        <Route path={'/'} element={<AppLayout />}>
          <Route path={'orders'} element={<div>Orders</div>} />
          <Route path={'profile'} element={<div>Profile</div>} />

          {/*CMS*/}
          <Route path={'cms'}>
            <Route path={'rubrics'} element={<RubricsRoute />} />
            <Route path={'products'} element={<ProductsRoute />} />
            <Route path={'rubric-variants'} element={<RubricVariantsRoute />} />
            <Route path={'attributes-groups'} element={<AttributesGroupsRoute />} />
            <Route path={'options-groups'} element={<OptionsGroupsRoute />} />
            <Outlet />
          </Route>

          {/*404*/}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

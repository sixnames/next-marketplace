import React from 'react';
import AppLayout from '../AppLayout/AppLayout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NotFound from '../../routes/NotFound/NotFound';

function App() {
  return (
    <Router>
      <Routes basename={'/app'}>
        <Route path={'/'} element={<AppLayout />}>
          <Route path={'orders'} element={<div>Orders</div>} />
          <Route path={'profile'} element={<div>Profile</div>} />

          {/*CMS*/}
          <Route path={'rubrics'} element={<div>Rubrics</div>} />
          <Route path={'products'} element={<div>Products</div>} />
          <Route path={'rubric-variants'} element={<div>Rubric variants</div>} />
          <Route path={'attributes-groups'} element={<div>Attributes groups</div>} />
          <Route path={'options-groups'} element={<div>Options groups</div>} />

          {/*404*/}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

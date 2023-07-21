import React from 'react';
import './SkeletonUi.scss';

function SkeletonUi() {
  return (
    <div className="skeleton-loding">
      <div className="container">
        {/* <!-- code here --> */}
        <div className="card">
          <div className="card-body">
            <h2 className="card-title skeleton">{/* <!-- wating for title to load from javascript --> */}</h2>
            <div>
              <p className="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
              <p className="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
              <p className="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
              <p className="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonUi;

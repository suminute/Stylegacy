import React from 'react';
import './SkeletonUi.scss';

function SkeletonUi() {
  return (
    <div className="skeleton-loding">
      <div class="container">
        {/* <!-- code here --> */}
        <div class="card">
          <div class="card-body">
            <h2 class="card-title skeleton">{/* <!-- wating for title to load from javascript --> */}</h2>
            <div>
              <p class="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
              <p class="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
              <p class="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
              <p class="card-intro skeleton">{/* <!-- waiting for intro to load from Javascript --> */}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonUi;

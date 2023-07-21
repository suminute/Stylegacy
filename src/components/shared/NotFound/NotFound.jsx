import React from 'react';
import './NotFound.scss';
import { useNavigate } from 'react-router';
import Button from '../Button';

function NotFound() {
  const navigate = useNavigate();
  return (
    <>
      <div className="NotFoundPage">
        <section class="wrapper">
          <div class="container">
            <div id="scene" class="scene" data-hover-only="false">
              <div class="circle" data-depth="1.2"></div>

              <div class="one" data-depth="0.9">
                <div class="content">
                  <span class="piece"></span>
                  <span class="piece"></span>
                  <span class="piece"></span>
                </div>
              </div>

              <div class="two" data-depth="0.60">
                <div class="content">
                  <span class="piece"></span>
                  <span class="piece"></span>
                  <span class="piece"></span>
                </div>
              </div>

              <div class="three" data-depth="0.40">
                <div class="content">
                  <span class="piece"></span>
                  <span class="piece"></span>
                  <span class="piece"></span>
                </div>
              </div>

              <p class="p404" data-depth="0.50">
                404
              </p>
              <p class="p404" data-depth="0.10">
                404
              </p>
            </div>

            <div class="text">
              <article>
                <p className="warning-text">이 페이지는 존재하지 않습니다.</p>
                <Button
                  onClick={() => {
                    navigate('/');
                  }}
                >
                  home
                </Button>
              </article>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default NotFound;

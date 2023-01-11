import axios from 'axios';
import React from 'react';
import styles from './style.module.css';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';

export const Main = () => {
  const [data, setData] = useState([]); //데이터 저장
  const [pageNum, setPageNum] = useState(1); //페이지 번호
  const [, /*loading */ setLoading] = useState(false); //로딩
  const target = useRef(); //옵저버 타겟

  //데이터 호출 함수
  const handleData = async () => {
    setLoading(true); //로딩 시작
    const res = await axios.get(
      `https://api.unsplash.com/photos/?client_id=${process.env.REACT_APP_FIREBASE_API_KEY}&page=${pageNum}&per_page=8`,
    );
    setData([...data, ...res.data]); //기존의 data값과 새로운 data값을 복제해서 setData에 추가해줌
    setLoading(false); //로딩 끝
  };

  //옵저버가 타겟을 식별하게 되면 현재 페이지에 +1
  const loadMore = () => setPageNum(prev => prev + 1);

  //페이지 번호가 변경될때마다 데이터 호출 함수 실행
  useEffect(() => {
    handleData();
  }, [pageNum]);

  //옵저버가 타겟을 식별하게 되면 loadMore 함수 실행
  useEffect(() => {
    let num = 1; // 페이지 호출 번호
    const totalPage = 6; //총 페이지 수
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        num++; //호출 번호 증가시킴
        loadMore();
        if (num >= totalPage) {
          //총 페이지 수 이상이거나 같으면 탐색중지
          observer.unobserve(target.current); //옵저버 타겟 변수 이름 / Ref.current
        }
      }
    });
    observer.observe(target.current); //옵저버 타겟 변수 이름 / Ref.current
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.box}>
        {data && (
          <ul>
            {data &&
              data.map(item => {
                return (
                  <li key={item.id}>
                    <img src={item.urls.small} alt="" />
                  </li>
                );
              })}
          </ul>
        )}
        <button ref={target} className="ir_pm">
          Load More
        </button>
      </div>
    </section>
  );
};

export default Main;

import React, { useState, useEffect, cloneElement, isValidElement } from "react";
import { useDrag } from "@use-gesture/react";
import styled from "@emotion/styled";

// https://codepen.io/wisnust10/pen/mPJwWv

const { round } = Math;

const IMAGES_BASE_URL = "http://localhost:3000";
const THUMBNAIL_WIDTH = 80;
const THUMBNAIL_HEIGHT = round((THUMBNAIL_WIDTH * 59) / 41);

const StyledApp = styled.div(`
  .swiper {
    touch-action: none;
  }
  
  .carousel {
    position: relative;

    .slide {
      width: 100%;
      max-width: 100%;
      max-height: 100%;
      position: fixed;
      inset: 0;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      /* user-drag: none; */
      object-fit: cover;
      object-position: top;

      opacity: 0;
      transition: opacity 0.3s ease-in-out;
  
      &::selection {
        background: none;
      }

      &.active {
        opacity: 1;
      }
    }
  }

  .carousel-thumbnails {
    display: flex;
    flex-wrap: wrap;

    .slide {
      width: ${THUMBNAIL_WIDTH}px;
      height: ${THUMBNAIL_HEIGHT}px;
      border: 2px solid transparent;
      box-sizing: content-box;

      &::selection {
        background: none;
      }

      &.active {
        border: 2px solid steelblue;        
      }

      &.anomaly {
        outline: ${2 + THUMBNAIL_WIDTH / 2}px solid rgba(255, 0, 0, 0.35);
        outline-offset: -${2 + THUMBNAIL_WIDTH / 2}px;
      }
    }
  }
`);

const { floor } = Math;

const SANDBOX_URLS = [
  "https://i.picsum.photos/id/449/820/1180.jpg?hmac=V6m1o3jcVdDqiXBsn0X0UNTkS5abwYw26bW14emeIvE",
  "https://i.picsum.photos/id/427/820/1180.jpg?hmac=tjPXyPZqtgS47a8rqrzf1mO6e4XRzdKs1n5KDsQkwOM",
  "https://i.picsum.photos/id/420/820/1180.jpg?hmac=Ozl-si2IsuQoL7RowyaQKQ9xntIpXijQfuKiNj8q7wU",
  "https://i.picsum.photos/id/465/820/1180.jpg?hmac=9xelYisjwFZte4gzxHdg1gzaEfovlj-KGUJk8v5jFYY",
  "https://i.picsum.photos/id/115/820/1180.jpg?hmac=368s2XIuhZMyNlIY8wNjFz2NeKvhZBy0rj16w0pGDlg",
  "https://i.picsum.photos/id/1047/820/1180.jpg?hmac=6iGMBUAMmxUWWSAD7xQV0J32h-pN5LHATxk-b75Z058",
  "https://i.picsum.photos/id/235/820/1180.jpg?hmac=x9-zOM7NVuSRqhTg-ccJzNh_7iGNJY3ZkMpUCYfLFKA",
  "https://i.picsum.photos/id/616/820/1180.jpg?hmac=-LJ8J5txcn86Z6Jk01tyGwFcqEIIoTOYjiWWc8_GyW8",
  "https://i.picsum.photos/id/790/820/1180.jpg?hmac=KfgjqnztuTSPClEuRPuHkPOYztG1jEDDo1Tnx0SN0UA",
  "https://i.picsum.photos/id/369/820/1180.jpg?hmac=9HPUKwx7sADdaOlIjKJLM7ODChOD8_BTv-yk92siAc8",
];

function Carousel({ index, urls }) {
  const width = window.innerWidth;
  console.log("Gallery", index, width);
  // "carousel-thumbnails"
  return (
    <div className="carousel" style={{ top: 0, left: 0 }}>
      {/* {[-1, 0, 1].map((d, i) => (
        <img key={i} className={`slide${i === 0 ? " active" : ""}`} src={urls[(index + d + count) % count]} />
      ))} */}
      {urls.map((d, i) => (
        <img
          key={i}
          className={`slide${i === index ? " active" : ""}${/\/anomalies\//.test(d) ? " anomaly" : ""}`}
          src={d}
        />
      ))}
    </div>
  );
}

function Slider({ count, children }) {
  const [state, setState] = useState({ startTime: 0, index: 0 });
  const bind = useDrag((dragState) => {
    // console.log("useDrag", dragState.swipe);
    if (!dragState.direction) return;
    const dx = dragState.direction[0];
    if (dx === 0) return;
    setState((prev) => {
      const startTime = floor(dragState.startTime);
      if (prev.startTime === startTime) return prev;
      if (prev.index === (prev.index - dx + count) % count) return prev;
      // console.log("useDrag", dragState.startTime.toFixed(0), dx);
      return { startTime, index: (prev.index - dx + count) % count };
    });
  }, {});
  useEffect(() => {
    window.addEventListener("keydown", (ev) => {
      ev.preventDefault();
      let dx = 0;
      if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") {
        dx = 1;
      } else if (ev.key === "ArrowRight" || ev.key === " " || ev.key === "Enter" || ev.key === "ArrowDown") {
        dx = -1;
      }
      if (dx === 0) return;
      setState((prev) => {
        const startTime = floor(ev.timeStamp);
        if (prev.startTime === startTime) return prev;
        if (prev.index === (prev.index - dx + count) % count) return prev;
        // console.log("keydown", startTime, dx);
        return { startTime, index: (prev.index - dx + count) % count };
      });
    });
  }, []);
  const childrenWithProps = React.Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, { index: state.index, count });
    }
    return child;
  });
  console.log("Slider", count);
  return (
    <div className="swiper" {...bind()}>
      {childrenWithProps}
    </div>
  );
}

function App() {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const url = new URL(window.location.search, IMAGES_BASE_URL).href;
    fetch(url)
      .then((data) => data.json())
      .then((data) => {
        setUrls(data.map((d) => new URL(d.url, IMAGES_BASE_URL).href));
      });
  }, []);
  return (
    <StyledApp>
      {urls && urls.length > 0 ? (
        <Slider count={urls.length}>
          <Carousel urls={urls} />
        </Slider>
      ) : null}
    </StyledApp>
  );
}

export default App;

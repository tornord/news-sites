import React, { useState, useEffect, cloneElement, isValidElement, useMemo } from "react";
import { useDrag } from "@use-gesture/react";
import styled from "@emotion/styled";

// https://codepen.io/wisnust10/pen/mPJwWv

const { round } = Math;

const IMAGES_BASE_URL = "http://localhost:3000";

const StyledApp = styled.div(({ thumbnailWidth = 160, highlightAnomalies = false }) => {
  const thumbnailHeight = round((thumbnailWidth * 59) / 41);
  return `
  .swiper {
    touch-action: none;
  }
  
  .carousel {
    position: relative;
    overflow: hidden;

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
    min-height: ${thumbnailHeight}px;

    .slide {
      width: ${thumbnailWidth}px;
      height: ${thumbnailHeight}px;
      border: 2px solid transparent;
      box-sizing: content-box;

      &::selection {
        background: none;
      }

      &.active {
        border: 2px solid steelblue;        
      }

      ${
        highlightAnomalies
          ? `&.anomaly {
        outline: ${2 + thumbnailWidth / 2}px solid rgba(255, 0, 0, 0.25);
        outline-offset: -${2 + thumbnailWidth / 2}px;
      }`
          : ""
      }
    }
  }
`;
});

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

function randomId() {
  return `${Math.floor(Math.random() * 16777216).toString(12)}`;
}

function Carousel({ index, urls, showThumbnails = false, onDrop = null }) {
  const rndId = useMemo(() => randomId());
  const width = window.innerWidth;
  console.log("Gallery", index, width);
  const imgDragBind = { draggable: showThumbnails };
  const carouselDropBind = {};
  if (showThumbnails) {
    imgDragBind.onDragStart = (ev) => {
      console.log("onDragStart");
      ev.dataTransfer.setData("application/carousel", ev.target.id);
      ev.dataTransfer.effectAllowed = "move";
    };
    carouselDropBind.onDragOver = (ev) => {
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    };
    carouselDropBind.onDrop = (ev) => {
      ev.preventDefault();
      const data = ev.dataTransfer.getData("application/carousel");
      if (!data) return;
      const currEl = document.getElementById(data);
      if (!currEl) return;
      let carEl = ev.target;
      if (carEl.nodeName === "IMG") {
        carEl = carEl.parentElement;
      }
      if (carEl === currEl.parentElement) return;
      const el = carEl.appendChild(currEl);
      if (!el) return;
      if (onDrop) {
        onDrop(el.src);
      }
    };
  }
  return (
    <div className={`carousel${showThumbnails ? "-thumbnails" : ""}`} style={{ top: 0, left: 0 }} {...carouselDropBind}>
      {/* {[-1, 0, 1].map((d, i) => (
        <img key={i} className={`slide${i === 0 ? " active" : ""}`} src={urls[(index + d + count) % count]} />
      ))} */}
      {urls.map((d, i) => (
        <img
          id={`img-${rndId}-${i}`}
          key={i}
          className={`slide${i === index ? " active" : ""}${/\/anomalies\//.test(d) ? " anomaly" : ""}`}
          src={d}
          {...imgDragBind}
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

function SlideShow() {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const url = new URL(window.location.search, IMAGES_BASE_URL).href;
    fetch(url)
      .then((data) => data.json())
      .then((data) => {
        setUrls(data.map((d) => new URL(d.url, IMAGES_BASE_URL).href));
      });
  }, []);
  return urls && urls.length > 0 ? (
    <Slider count={urls.length}>
      <Carousel urls={urls} showThumbnails={false} />
    </Slider>
  ) : null;
}

const StyledList = styled.ul(() => {
  return `
    margin: 0.5rem 0;
    display: flex;
    list-style: none;
    padding-left: 0;
    flex-wrap: wrap;

    li {
      margin: 0 0.5rem;
    }
  `;
});

function List({ items, queryName }) {
  const link = (v) => `/admin/?${queryName}=${v}`;
  return (
    <StyledList>
      {items.map((d, i) => (
        <li key={i}>
          <a href={link(d)}>{d}</a>
        </li>
      ))}
    </StyledList>
  );
}

function Admin() {
  const [images, setImages] = useState(null);
  const [doneUrls, setDoneUrls] = useState(null);
  const [anomaliesUrls, setAnomaliesUrls] = useState(null);
  const [binUrls, setBinUrls] = useState(null);
  const getArray = (images, key) => {
    let arr = [];
    if (images && images.length > 0) {
      const dict = {};
      for (const d of images) {
        dict[d[key]] = true;
      }
      arr.push(...Object.keys(dict));
      arr.sort();
    }
    return arr;
  };
  let names = getArray(images, "name");
  let dates = getArray(images, "date");
  const handleDrop = (url, folder) => {
    fetch(new URL("move", IMAGES_BASE_URL).href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, folder }),
    });
    console.log("handleDrop", url, folder);
  };
  useEffect(() => {
    const allImagesUrl = new URL("/?count=0", IMAGES_BASE_URL);
    fetch(allImagesUrl.href)
      .then((data) => data.json())
      .then((data) => {
        setImages(data);
      });
    const doFetch = (type, callback) => {
      const url = new URL(window.location.search, IMAGES_BASE_URL);
      url.searchParams.set("type", type);
      fetch(url.href)
        .then((data) => data.json())
        .then((data) => {
          const arr = data.map((d) => new URL(d.url, IMAGES_BASE_URL).href);
          arr.sort();
          callback(arr);
        });
    };
    doFetch("done", setDoneUrls);
    doFetch("anomalies", setAnomaliesUrls);
    doFetch("bin", setBinUrls);
  }, []);
  return (
    <>
      {names.length > 0 ? <List items={names} queryName="name" /> : null}
      {dates.length > 0 ? <List items={dates} queryName="date" /> : null}
      {doneUrls !== null ? (
        <Carousel urls={doneUrls} showThumbnails={true} onDrop={(ev) => handleDrop(ev, "done")} />
      ) : null}
      <hr />
      {anomaliesUrls !== null ? (
        <Carousel urls={anomaliesUrls} showThumbnails={true} onDrop={(ev) => handleDrop(ev, "anomalies")} />
      ) : null}
      <hr />
      {binUrls !== null ? (
        <Carousel urls={binUrls} showThumbnails={true} onDrop={(ev) => handleDrop(ev, "bin")} />
      ) : null}
    </>
  );
}

function App() {
  const [urls, setUrls] = useState([]);
  const [thumbnailWidth, setThumbnailWidth] = useState(160);
  const admin = window.location.pathname.startsWith("/admin/");
  return (
    <StyledApp thumbnailWidth={thumbnailWidth} highlightAnomalies={true}>
      <StyledList>
        {[72, 80, 120, 160, 200, 405].map((d, i) => (
          <li
            key={i}
            onClick={() => {
              setThumbnailWidth(() => d);
            }}
          >
            <a href="#">{d}</a>
          </li>
        ))}
      </StyledList>
      {admin ? <Admin /> : <SlideShow />}
    </StyledApp>
  );
}

export default App;

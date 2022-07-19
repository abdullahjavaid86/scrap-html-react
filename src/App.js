import "./App.css";

import { useCallback, useEffect, useState } from "react";

import axios from "axios";
import { load } from "cheerio";

function App() {
  const [demo, setDemo] = useState("");
  const [url, setUrl] = useState(
    "https://www.idealista.pt/en/imovel/31938779/"
  );

  const getHTML = useCallback((isMounted) => {
    axios
      .get(url)
      .then((res) => {
        if (isMounted) {
          const $ = load(res.data);
          setDemo($(".comment").html());
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log("successfully aborted");
        } else {
          console.error(err);
        }
      });
  }, [url])

  useEffect(() => {
    let isMounted = true;
    getHTML(isMounted);
    return () => {
      isMounted = false;
    };
  }, [getHTML]);

  /**
   * @param {React.ChangeEvent<HTMLInputElement} e
   */
  const onUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const onClick = () => {
    getHTML(true)
  }

  return (
    <div className="App">
      <header className="App-header">
        <input name="url" type="url" value={url} onChange={onUrlChange} />
        <button onClick={onClick}>Submit</button>
        <div
          dangerouslySetInnerHTML={{
            __html: demo,
          }}
        />
      </header>
    </div>
  );
}

export default App;

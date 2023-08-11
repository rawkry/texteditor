import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from "quill-image-resize-module-react";
import ReactHtmlParser from "react-html-parser";
import "./App.css"; // Import your CSS styles
ReactQuill.Quill.register("modules/imageResize", ImageResize);
function App() {
  const [editorHtml, setEditorHtml] = useState("");
  const [parsedHtml, setParsedHtml] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const handleBlog = async (e) => {
    // const res = await fetch("http://192.168.1.82:3000/richs", {
    //   method: "get",
    //   // body: JSON.stringify({ data: parsingData }),
    // });
    // console.log(res);
    const parsingData = ReactHtmlParser(editorHtml);
    setParsedHtml(parsingData);
    const res = await fetch("http://192.168.1.82:3000/rich", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: "This is title",
        slug: "this-is-slug",
        content: editorHtml,
      }),
    });
    console.log(res);
  };

  const getblogs = async () => {
    const res = await fetch("http://192.168.1.82:3000/richs", {
      method: "get",
    });
    const data = await res.json();
    setBlogs(data);
    console.log(res);
  };
  useEffect(() => {
    getblogs();
  }, []);

  console.log(blogs);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ color: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    imageResize: {},
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "color",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={setEditorHtml}
        modules={modules}
        formats={formats}
      />
      <button onClick={handleBlog}>Save</button>
      <div>
        <h2>HTML Output</h2>

        <div className="output-container">
          {parsedHtml.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
        {/* <div
          className="output-container"
          dangerouslySetInnerHTML={{ __html: editorHtml }}
        /> */}

        <h2>React-HTML-Parser Output</h2>
        {editorHtml}
      </div>

      <div>
        {blogs.map((blog) => (
          <div key={blog._id}>
            <h1>{blog.title}</h1>
            <div>{ReactHtmlParser(blog.content)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

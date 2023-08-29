import RichTextEditor from "../components/RichTextEditor";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");
  return (
    <>
      <main>
        <RichTextEditor value={value} setValue={setValue} />
      </main>
    </>
  );
}

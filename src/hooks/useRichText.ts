import { useAgent } from "@/state/session";
import { RichText as RichTextAPI } from "@atproto/api";
import { useEffect, useState } from "react";

export default function useRichText(text: string): [RichTextAPI, boolean] {
  const agent = useAgent();
  const [prevText, setPrevText] = useState(text);
  const [rawRT, setRawRT] = useState(() => new RichTextAPI({ text }));
  const [resolvedRT, setResolvedRT] = useState<RichTextAPI | null>(null);
  if (text !== prevText) {
    setPrevText(text);
    setRawRT(new RichTextAPI({ text }));
    setResolvedRT(null);
    // This will queue an immediate re-render
  }
  useEffect(() => {
    let ignore = false;
    async function resolveRTFacets() {
      // new each time
      const resolvedRT = new RichTextAPI({ text });
      await resolvedRT.detectFacets(agent);
      if (!ignore) {
        setResolvedRT(resolvedRT);
      }
    }
    resolveRTFacets();
    return () => {
      ignore = true;
    };
  }, [text, agent]);
  const isResolving = resolvedRT === null;
  return [resolvedRT ?? rawRT, isResolving];
}

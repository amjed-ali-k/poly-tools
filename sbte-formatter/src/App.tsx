import "./App.css";
import { Stack, InputGroup, Input, Button } from "@chakra-ui/react";
import { useState } from "react";
import { formatData, parseCsv } from "./core/main";

function App() {
  const [file, setFile] = useState<File | undefined>(undefined);
  return (
    <div>
      <Stack spacing={4} margin={10} padding={10}>
        <InputGroup>
          <input
            type="file"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : undefined)
            }
          />
        </InputGroup>

        {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
        <Button
          colorScheme="blue"
          onClick={() =>
            file &&
            parseCsv(file, (e) => {
              console.log(formatData(e));
            })
          }
        >
          Start
        </Button>
      </Stack>
    </div>
  );
}

export default App;

import {
  Stack,
  InputGroup,
  Button,
  Heading,
  Box,
  Flex,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Select,
  Tag,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { convertToXlsx, formatData, parseCsv, ResultType } from "./core/main";
import { Icon } from "@iconify/react";

function validateFileType(file: File) {
  const fileName = file.name;
  const idxDot = fileName.lastIndexOf(".") + 1;
  const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
  if (extFile == "csv") {
    return true;
  } else {
    return false;
  }
}

function App() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState<ResultType[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const handleClick = () => inputRef.current?.click();
  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    if (!validateFileType(e.target.files[0])) return;
    setFile(e.target.files[0]);
    parseCsv(e.target.files[0], setData);
  };

  const handleProcess = () => {
    if (!file || data.length === 0) {
      toast({
        title: "No files selected.",
        description: `Select a file to process and retry.`,
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const d = formatData(data);
    const dir = convertToXlsx(
      d,
      `result-${month}-${year}-${
        d[0].semester ? "S" + d[0].semester.toString() : ""
      }.xlsx`
    );
    toast({
      title: "File processed.",
      description: `${dir} saved to downloads folder.`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      flexGrow="1"
      height="100vh"
      css={{
        userSelect: "none",
      }}
    >
      <Box>
        <Card w="lg">
          <CardHeader>
            <Heading size="md">Process file</Heading>
          </CardHeader>

          <CardBody>
            <Stack mb={4}>
              <FormControl>
                <FormLabel>Result file from SBTE</FormLabel>
                <InputGroup
                  display="flex"
                  alignItems="center"
                  onClick={handleClick}
                >
                  <input
                    ref={inputRef}
                    accept={".csv"}
                    type="file"
                    hidden
                    onChange={handleUpload}
                  />
                  <Button
                    leftIcon={
                      <Icon inline icon="material-symbols:upload-file" />
                    }
                  >
                    <span style={{ marginTop: 3 }}>Upload File</span>
                  </Button>
                  <Tag
                    mx={3}
                    height="fit-content"
                    display="flex"
                    alignItems="center"
                  >
                    <Icon
                      style={{ marginRight: 4, display: "block" }}
                      inline
                      icon="material-symbols:upload-file"
                    />
                    {file ? (
                      <div style={{ paddingTop: 4 }}>{file.name}</div>
                    ) : (
                      "No file selected"
                    )}
                  </Tag>
                </InputGroup>
                {/* <FormHelperText>
                    {file ? file.name : "No file selected"}
                  </FormHelperText> */}
              </FormControl>
              <Box>
                <Divider my={3} />
              </Box>
              <FormControl>
                <FormLabel>Month</FormLabel>
                <Select
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="Select month of exam"
                >
                  <option value="April">April</option>
                  <option value="November">November</option>
                </Select>
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
              <FormControl>
                <FormLabel>Year</FormLabel>
                <Select
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Select year of exam"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </Select>
                {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
              </FormControl>
            </Stack>

            {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
            <Button
              my={2}
              colorScheme="blue"
              rightIcon={<Icon icon="codicon:debug-start" />}
              onClick={handleProcess}
            >
              <span style={{ marginTop: 3 }}>Start</span>
            </Button>
          </CardBody>
        </Card>
      </Box>
      <Box p="5" display="flex">
        Made with
        <Icon
          icon="noto-v1:heart-suit"
          style={{ marginLeft: 4, marginTop: 3, marginRight: 4 }}
          inline
        />{" "}
        Amjed Ali K
      </Box>
    </Flex>
  );
}

export default App;

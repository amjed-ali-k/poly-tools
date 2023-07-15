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
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  convertToXlsx,
  formatData,
  parseCsv,
  ResultType,
  AllGrades,
} from "./core/main";
import { Icon } from "@iconify/react";
import { save } from "@tauri-apps/api/dialog";
import { writeBinaryFile } from "@tauri-apps/api/fs";
import { validateCSV, validateFileType } from "./core/csvValidation";

function App() {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [data, setData] = useState<ResultType[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isError, setIsError] = useState(false);
  const toast = useToast();

  const handleClick = () => inputRef.current?.click();

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (!e.target.files) return;
    if (!validateFileType(e.target.files[0])) return;
    setFile(e.target.files[0]);
    const validatedResult = validateCSV(await e.target.files[0].text());
    if (validatedResult !== true) {
      toast({
        title: "Invalid file.",
        description: validatedResult,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setIsError(true);
      return;
    }
    parseCsv(e.target.files[0], setData);
  };

  const handleProcess = async () => {
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
    const resultFile = convertToXlsx(d);
    const filePath = await save({
      filters: [
        {
          name: ".xlsx",
          extensions: ["xlsx"],
        },
      ],
    });
    if (filePath === null) return;
    writeBinaryFile(filePath, resultFile);

    toast({
      title: "File processed.",
      description: `${filePath} saved`,
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const clearFile = () => {
    setFile(undefined);
    setData([]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
                <FormLabel>
                  Result file from SBTE
                  <Text fontSize="xs" color={"gray.500"}>
                    Choose the file you recieved after unziping downloaded file.
                    Don't select any modified file.
                  </Text>
                </FormLabel>
                <InputGroup
                  display="flex"
                  alignItems="center"
                  onClick={file ? clearFile : handleClick}
                >
                  <input
                    ref={inputRef}
                    accept={".csv"}
                    type="file"
                    hidden
                    onChange={handleUpload}
                  />
                  {file ? (
                    <Button
                      colorScheme="red"
                      leftIcon={<Icon inline icon="material-symbols:delete" />}
                    >
                      <span style={{ marginTop: 3 }}>Remove file</span>
                    </Button>
                  ) : (
                    <Button
                      leftIcon={
                        <Icon inline icon="material-symbols:upload-file" />
                      }
                    >
                      <span style={{ marginTop: 3 }}>Upload File</span>
                    </Button>
                  )}
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
            </Stack>

            {/* If you add the size prop to `InputGroup`, it'll pass it to all its children. */}
            <Button
              my={2}
              colorScheme="blue"
              rightIcon={<Icon icon="codicon:debug-start" />}
              onClick={handleProcess}
              disabled={isError || !file}
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
        by Amjed Ali K
      </Box>
    </Flex>
  );
}

export default App;

import { Container, Box, Text, Center } from "@chakra-ui/react";
import { useState } from "react";
import { Tabs, Tab, TabPanel, TabPanels, TabList } from "@chakra-ui/react";
import Login from "./Login.jsx"; // Import your Login component
import Sign from "./Signup.jsx"
const Home = () => {
    return (
        <Container maxW="5xl" centerContent>
            <Center flexDirection="column">
                <Box
                    d="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                    textAlign="center"
                    bg="#0d84bf"
                    color="white"
                    borderRadius="10px"
                    borderWidth="1px"
                    w="400px"
                    m="40px 0 15px 0"
                >
                    <Text>Keep In Touch</Text>
                </Box>
                <Box 
                    d="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                    textAlign="center"
                    bg="white"
                    color="black"
                    borderRadius="10px"
                    borderWidth="1px"
                    boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
                    w="400px"
                    m="40px 0 15px 0"
                >
                    <Tabs variant='soft-rounded' colorScheme='green'>
                        <TabList>
                            <Tab className="Tab">Login</Tab>
                            <Tab className="Tab">SignUp</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Login />
                            </TabPanel>
                            <TabPanel>
                                <Sign/>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Center>
        </Container>
    );
};

export default Home;

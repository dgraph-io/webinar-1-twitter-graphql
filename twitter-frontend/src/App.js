import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Form, Button, Modal, Container, Card } from 'react-bootstrap';
import gql from 'graphql-tag';
import ApolloClient from 'apollo-boost';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

const client = new ApolloClient({
    uri: 'http://localhost:8080/graphql',
});

const GET_TWEETS = gql`
{
    queryTweet {
        id
        tweet
        author {
            name
            handle
        }
        mentioned {
            handle
        }
        tagged {
            hashtag
        }
    }
}
`;

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [search, setSearch] = useState("");
    const [userId, setUserId] = useState(null);
    const [tweets, setTweets] = useState([]);

    const getUser = async () => {

    };

    const getTweets = async () => {
        const res = await client.query({ query: GET_TWEETS });
        setTweets(res.data.queryTweet);
    };
    useEffect(() => { getTweets(); }, [null]);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand>Tweeter</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mx-auto">
                        <Form inline>
                            <Form.Control
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Button 
                                variant="secondary"
                                className="ml-1"
                            >
                                Search
                            </Button>
                        </Form>
                    </Nav>

                    <Form inline>
                        <Button 
                            variant="primary"
                            onClick={e => setShowLogin(true)}
                        >
                            Login
                        </Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>

            <Container className="py-5">
                <Card className="p-3 mb-4">
                    <Form.Control as="textarea" placeholder="Let's get tweeting!" />
                    <div className="pt-2 text-right">
                        <Button>Tweet</Button>
                    </div>
                </Card>

                {tweets.map(tweet => (
                    <Card 
                        className="p-3 mb-3"
                        key={tweet.id}
                    >
                        <div className="pb-1">
                            <b>{tweet.author.name}</b>
                            <span className="text-muted pl-2">{tweet.author.handle}</span>
                        </div>

                        <div className="pb-2">
                            {tweet.tweet}
                        </div>

                        <div className="pb-1">
                            Tagged: {tweet.tagged.map(tag => <span className="pr-2" key={tag.hashtag}><a href="#">#{tag.hashtag}</a></span>)}
                        </div>

                        <div>
                            Mentioned: {tweet.mentioned.map(user => <span className="pr-2" key={user.handle}><a href="#">@{user.handle}</a></span>)}
                        </div>
                    </Card>
            ))}
            </Container>

            <Modal show={showLogin} onHide={() => setShowLogin(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form.Control 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogin(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={getUser}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default App;

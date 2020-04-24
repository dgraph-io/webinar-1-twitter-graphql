# Webinar 1 - Build a Twitter clone using GraphQL - April 23rd, 2020

Here's the schema we built in the beginning:

```graphql
type User {
    id: ID!
    name: String 
    handle: String
    authored: [Tweet]
}

type Tweet {
    id: ID!
    tweet: String
    tagged: [Hashtag]
    mentioned: [User]
}

type Hashtag {
    id: ID!
    hashtag: String 
}
```

And here's the schema we ended with:
```graphql
type User {
    id: ID!
    name: String @search(by: [regexp])
    handle: String
    authored: [Tweet] @hasInverse(field: author)
}

type Tweet {
    id: ID!
    tweet: String
    author: User @hasInverse(field: authored)
    tagged: [Hashtag]
    mentioned: [User]
}

type Hashtag {
    id: ID!
    hashtag: String 
}
```
As you can see, we added `@search` directives to allow searching on those fields, and we added a `@hasInverse` directive to tell Dgraph that each of those fields represent the same relationship (User created Tweet).

Here are some of the queries and mutations we ran:

Inserting a new user, with a tweet and mentions.
```graphql
mutation {
  addUser(input: [
    {
      name: "Prashant",
      handle: "c0degeas",
      authored: [
        {
          tweet: "Excited for GraphQL Asia along with @hackintoshrao and other folks from @dgraphlabs.\n#GraphQL #GraphQLAsia",
          tagged: [
            { hashtag: "GraphQL" },
            { hashtag: "GraphQLAsia" }
          ],
          mentioned: [
            { name: "Karthic Rao", handle: "hackintoshrao" },
            { name: "Dgraph Labs", handle: "dgraphlabs" }
          ]
        }
      ]
    }
  ]) {
    user {
      id
      name
      handle
      authored {
        tweet
        tagged {
          hashtag
        }
        mentioned {
          handle
        }
      }
    }
  }
}
```

Get a list of all tweets.
```graphql
query {
  queryTweet {
    tweet
    author {
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
```

```graphql
query {
  queryTweet {
    tweet
    author {
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
```

Update the user we inserted. Make sure to replace the "0x12" with the id value returned in step 1.
```graphql
mutation {
  updateUser(input:{ 
    filter:{ id: ["0x12"]}, 
    set:{
      name: "Ahmed El Bannan",
      handle: "newh@ndle"
    }
  }) {
    user {
      name
      handle
    }
  }
}
```

Search tweet by the terms "graphql asia". This is possible because of the 'fulltext' index.
```graphql
query {
  queryTweet(filter: { 
    tweet: { 
      alloftext: "graphql asia" 
    }
  }) {
    tweet
  }
}
```

Find users with 'El Bannan' in their name.
```graphql
query {
  queryUser(filter:{
    name:{
      regexp:"/El Bannan/"
    }
  }) {
    name
    handle
  }
}
```


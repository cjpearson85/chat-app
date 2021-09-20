# users
## get/users
default pagination: 10
default sort: createdAt, descending
returns: _id, bio, avatar_url, username
queries: limit, page, order = desc, asc
note: limit = 0 returns all users

## get users/:user_id
returns: _id, bio, avatar_url, username

## patch users/:user_id
request: {
    bio: string
    username: string
    password: string
    avatar_url: string
} (one required)
returns: _id, bio, avatar_url, username

## delete /users/:user_id
status: 204

## post /signup
request: {
    username
    password
    avatar_url (opt)
    bio (opt)
}
returns: _id, bio, avatar_url, username

## post /login
request: {
    username
    password
}
returns: 'Logged in'

## get /users/:user_id/likes
returns {
    likes: {
        routes: [route_id, ...],
        comments: [],
        pois: []
    }
}
queries: like_type = pois, comments, routes

## get /users/:user_id/following
returns [followed_id, ...]

## get /users/:user_id/followed
returns [follower_id, ...]

## post /users/:user_id/following
request {
    follow: user_id
}
returns: _id, follower_id, followed_id

## delete /users/:user_id/following
request {
    follow: user_id
}
status: 204 (user in request body is unfollowed)

# routes
## get /routes
default limit: 5
default sort: start_time_date, desc
returns: _id, title, description, user_id, likes
    coords: {latitude, longitude, time}, start_time_date
queries: limit, page, order (= asc, desc), 
    sort_by (= start_time_date, likes), user_id

## get/routes/:route_id
returns: _id, title, description, user_id, likes
    coords: {latitude, longitude, time}, start_time_date

## post /routes
request {
    title 
    description (opt)
    user_id
    coords: [{latitude, longitude, time}, ...]
    start_time_date
}
returns: _id, title, description, user_id
    coords: {latitude, longitude, time}, start_time_date

## patch /routes/:route_id
request {
    title
    likes (= 1, -1)
    user (required if like is given)
}
returns: _id, title, description, user_id, likes
    coords: {latitude, longitude, time}, start_time_date

## delete /routes/:route_id
status: 204

# POI
## get routes/:route_id/poi
returns: _id, photo, narration, coords: {longitude, latitude, time}, user_id, route_id, likes

## post routes/:route_id/poi
request {
    user_id
    photo (opt)
    narration (opt)
    coords: {longitude, latitude, time}
} 
returns: _id, photo, narration, coords: {longitude, latitude, time}, user_id, route_id, likes

## patch /poi/:poi_id
request {
    photo
    narration
    likes (= 1, -1)
    user_id (required if likes given)
}
returns: _id, photo, narration, coords: {longitude, latitude, time}, user_id, route_id, likes

## delete /poi/:poi_id
status: 204

# Comments
## get /routes/:route_id/comments
default limit: 15
default sort: createdAt desc
returns: _id, route_id, user_id, body, likes, createdAt
queries: limit, page, sort_by (= likes, createdAt), order (= asc, desc)

## post /routes/:route_id/comments
request {
    user_id
    body
}
returns: _id, route_id, user_id, body, likes, createdAt

## patch comments/:comment_id
request {
    body
    likes (= 1, -1)
    user_id (required if likes)
}
returns: _id, route_id, user_id, body, likes, createdAt

## delete comments/:comment_id
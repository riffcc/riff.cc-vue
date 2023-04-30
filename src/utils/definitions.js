// This is an auto-generated file, do not edit manually
export const definition = {"models":{"Admin":{"id":"kjzl6hvfrbw6c5giv6kfuo8lntr4fezd7xany7wr9u1swu82mktgha3ju87xcc8","accountRelation":{"type":"list"}},"Piece":{"id":"kjzl6hvfrbw6c6qcoevax4ddixl88n29vmno4fwocyrg4d5tljd36f99llh0aj7","accountRelation":{"type":"list"}},"PinLike":{"id":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","accountRelation":{"type":"list"}},"Subscription":{"id":"kjzl6hvfrbw6c6k3oz1srv6kwnjja6ek5o21u1pyljnvrl8v1tbyn3woyavu30p","accountRelation":{"type":"list"}},"Featured":{"id":"kjzl6hvfrbw6c52iaf9rdcjkyh3c4usze0eyzu205crrdnjxn0fubmr1cbx27pf","accountRelation":{"type":"list"}},"EthAccount":{"id":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","accountRelation":{"type":"list"}},"Website":{"id":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","accountRelation":{"type":"list"}},"PinDislike":{"id":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","accountRelation":{"type":"list"}},"Category":{"id":"kjzl6hvfrbw6c9hj6opiwnyndw8bhmnzvdjzv3q20qp6chcm7k85fyhy01l0lw1","accountRelation":{"type":"list"}},"Pin":{"id":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","accountRelation":{"type":"list"}}},"objects":{"AdminMetadata":{"createdAt":{"type":"string","required":true},"updatedAt":{"type":"string","required":true}},"Admin":{"super":{"type":"boolean","required":true},"adminID":{"type":"streamid","required":true},"inactive":{"type":"boolean","required":false},"metadata":{"type":"reference","refType":"object","refName":"AdminMetadata","required":true},"websiteID":{"type":"streamid","required":true},"admin":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","property":"adminID"}},"website":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","property":"websiteID"}}},"PieceDetails":{"tags":{"type":"string","required":false},"type":{"type":"string","required":false},"media":{"type":"string","required":false},"IMDBID":{"type":"string","required":false},"TMDBID":{"type":"string","required":false},"format":{"type":"string","required":false},"poster":{"type":"string","required":false},"bitrate":{"type":"string","required":false},"albumTitle":{"type":"string","required":false},"artistNames":{"type":"string","required":false},"releaseType":{"type":"string","required":false},"musicBrainzID":{"type":"string","required":false},"imageThumbnailCID":{"type":"string","required":false},"initialReleaseYear":{"type":"string","required":false},"releaseDescription":{"type":"string","required":false}},"PieceMetadata":{"createdAt":{"type":"string","required":true},"updatedAt":{"type":"string","required":true}},"Piece":{"CID":{"type":"string","required":false},"name":{"type":"string","required":false},"details":{"type":"reference","refType":"object","refName":"PieceDetails","required":false},"metadata":{"type":"reference","refType":"object","refName":"PieceMetadata","required":true}},"PinLike":{"pinID":{"type":"streamid","required":true},"ownerID":{"type":"streamid","required":true},"categoryID":{"type":"streamid","required":true},"pin":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"pinID"}},"owner":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","property":"ownerID"}},"category":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9hj6opiwnyndw8bhmnzvdjzv3q20qp6chcm7k85fyhy01l0lw1","property":"categoryID"}}},"SubscriptionMetadata":{"createdAt":{"type":"string","required":true},"updatedAt":{"type":"string","required":true}},"Subscription":{"inactive":{"type":"boolean","required":false},"metadata":{"type":"reference","refType":"object","refName":"SubscriptionMetadata","required":true},"websiteID":{"type":"streamid","required":true},"subscribedID":{"type":"streamid","required":true},"website":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","property":"websiteID"}},"subscribedWebsite":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","property":"subscribedID"}}},"Featured":{"endAt":{"type":"string","required":true},"pinID":{"type":"streamid","required":true},"startAt":{"type":"string","required":true},"websiteID":{"type":"streamid","required":true},"pin":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"pinID"}},"website":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","property":"websiteID"}}},"EthAccountMetadata":{"createdAt":{"type":"string","required":true},"updatedAt":{"type":"string","required":true}},"EthAccount":{"address":{"type":"string","required":true},"ensName":{"type":"string","required":false},"metadata":{"type":"reference","refType":"object","refName":"EthAccountMetadata","required":true},"websiteID":{"type":"streamid","required":true},"pins":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"ownerID"}},"pinsCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"ownerID"}},"managedWebsites":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c5giv6kfuo8lntr4fezd7xany7wr9u1swu82mktgha3ju87xcc8","property":"adminID"}},"managedWebsitesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c5giv6kfuo8lntr4fezd7xany7wr9u1swu82mktgha3ju87xcc8","property":"adminID"}},"pinLikes":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","property":"ownerID"}},"pinLikesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","property":"ownerID"}},"pinDislikes":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","property":"ownerID"}},"pinDislikesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","property":"ownerID"}}},"WebsiteMetadata":{"createdAt":{"type":"string","required":true},"updatedAt":{"type":"string","required":true}},"Website":{"image":{"type":"string","required":false},"metadata":{"type":"reference","refType":"object","refName":"WebsiteMetadata","required":true},"description":{"type":"string","required":false},"websiteName":{"type":"string","required":true},"categories":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c9hj6opiwnyndw8bhmnzvdjzv3q20qp6chcm7k85fyhy01l0lw1","property":"websiteID"}},"categoriesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c9hj6opiwnyndw8bhmnzvdjzv3q20qp6chcm7k85fyhy01l0lw1","property":"websiteID"}},"pins":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"websiteID"}},"pinsCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"websiteID"}},"featured":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c52iaf9rdcjkyh3c4usze0eyzu205crrdnjxn0fubmr1cbx27pf","property":"websiteID"}},"featuredCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c52iaf9rdcjkyh3c4usze0eyzu205crrdnjxn0fubmr1cbx27pf","property":"websiteID"}},"subscriptions":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c6k3oz1srv6kwnjja6ek5o21u1pyljnvrl8v1tbyn3woyavu30p","property":"websiteID"}},"subscriptionsCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c6k3oz1srv6kwnjja6ek5o21u1pyljnvrl8v1tbyn3woyavu30p","property":"websiteID"}},"admins":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c5giv6kfuo8lntr4fezd7xany7wr9u1swu82mktgha3ju87xcc8","property":"websiteID"}},"adminsCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c5giv6kfuo8lntr4fezd7xany7wr9u1swu82mktgha3ju87xcc8","property":"websiteID"}},"users":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","property":"websiteID"}},"usersCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","property":"websiteID"}}},"PinDislike":{"pinID":{"type":"streamid","required":true},"ownerID":{"type":"streamid","required":true},"categoryID":{"type":"streamid","required":true},"pin":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"pinID"}},"owner":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","property":"ownerID"}},"category":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9hj6opiwnyndw8bhmnzvdjzv3q20qp6chcm7k85fyhy01l0lw1","property":"categoryID"}}},"Category":{"name":{"type":"string","required":true},"websiteID":{"type":"streamid","required":true},"website":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","property":"websiteID"}},"pins":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"categoryID"}},"pinsCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c65fxsu5qwg5egl6zp4nfehwb1m0mbujcl080k80ki4k7var0em","property":"categoryID"}},"likes":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","property":"categoryID"}},"likesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","property":"categoryID"}},"dislikes":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","property":"categoryID"}},"dislikesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","property":"categoryID"}}},"Pin":{"deleted":{"type":"boolean","required":false},"ownerID":{"type":"streamid","required":true},"pieceID":{"type":"streamid","required":true},"approved":{"type":"boolean","required":false},"rejected":{"type":"boolean","required":false},"websiteID":{"type":"streamid","required":true},"categoryID":{"type":"streamid","required":true},"rejectionReason":{"type":"string","required":false},"owner":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c89r3b91kppt8k2o1irlcdvf0efd2jv9a222emhv9d7obcr0c7z","property":"ownerID"}},"piece":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c6qcoevax4ddixl88n29vmno4fwocyrg4d5tljd36f99llh0aj7","property":"pieceID"}},"website":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c71nk96nv5suu5cm7dezduof5amul7bne117pn2s5jd6l8njx0n","property":"websiteID"}},"category":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9hj6opiwnyndw8bhmnzvdjzv3q20qp6chcm7k85fyhy01l0lw1","property":"categoryID"}},"likes":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","property":"pinID"}},"likesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c5nsxn67eve5fgu4nmgjsq5apgbkwx7qfxru1px7869aekcekdv","property":"pinID"}},"dislikes":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","property":"pinID"}},"dislikesCount":{"type":"view","viewType":"relation","relation":{"source":"queryCount","model":"kjzl6hvfrbw6c7e6th2a8d6qq6t4qhusukxhnzzqhvjzi0jbmooujdljfc067ui","property":"pinID"}}}},"enums":{},"accountData":{"adminList":{"type":"connection","name":"Admin"},"pieceList":{"type":"connection","name":"Piece"},"pinLikeList":{"type":"connection","name":"PinLike"},"subscriptionList":{"type":"connection","name":"Subscription"},"featuredList":{"type":"connection","name":"Featured"},"ethAccountList":{"type":"connection","name":"EthAccount"},"websiteList":{"type":"connection","name":"Website"},"pinDislikeList":{"type":"connection","name":"PinDislike"},"categoryList":{"type":"connection","name":"Category"},"pinList":{"type":"connection","name":"Pin"}}}
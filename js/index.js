let express = require(`express`)
let app = express()

let port = 3000
app.listen(port, ()=>{
    console.log(`http://localhost:${port}`)
})

let { faker } = require(`@faker-js/faker/locale/ru`)
app.use(express.static(`assets`))

const hbs = require(`hbs`)
app.set(`views`, `views`)
app.set('view engine','hbs')

hbs.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});

app.use(express.urlencoded({ extended: true }))

let cats = [];
for (let i = 1; i <= 12; i++) {
    let sex = faker.person.sex()
    let cat = {
        sex: sex,
        name: faker.person.firstName(sex),
        photo: faker.image.urlLoremFlickr({ category: 'cats' }),
        age: faker.number.int({ min: 1, max: 15}),
        breed: faker.animal.cat(),
        wanted: false,
        adopted: false,
        likes: 0,
        comments: []
    }
    cats.push(cat);
}

app.get(`/`, (req, res)=>{
    res.render(`index`,{
    })
})

app.get(`/admin`, (req, res)=>{
    res.render(`admin`,{
        cats: cats
    })
})

app.get(`/addCat`, (req, res)=>{
    res.render(`addCat`,{
        cats: cats
    })
})

app.get('/deleteCat', function(req, res) {
    let id = req.query.id;
    if (cats[id]) {
        cats.splice(id, 1)
    }
    res.redirect(`/admin`);
})

app.get('/likeCat', function(req, res) {
    let id = req.query.id;
    if (cats[id]) {
        cats[id].likes += 1
    }
    res.redirect(`/pets`);
})

app.get('/addComment', function(req, res) {
    let name = req.query.name;
    let text = req.query.text;
    let id = req.query.id;
    if (cats[id]) {
        cats[id].comments.push({
            name: name,
            text: text
        })
    }
    res.redirect(`/pets`);
})

app.post('/addCat', function(req, res) {
    let name = req.body.name
    let breed = req.body.breed
    let age = req.body.age
    let photo = req.body.photo
    let sex = req.body.sex
    cats.push({
        sex: sex,
        name: name,
        photo: photo,
        age: age,
        breed: breed,
        wanted: false,
        adopted: false,
        likes: 0,
        comments: []
    })
    res.redirect(`/admin`)
});

app.post('/subscription', function(req, res) {
    let name = req.body.name
    let email = req.body.email
    res.render(`subscription_success`, {email: email, name: name})
});

app.get(`/subscription`, (req, res)=>{
    res.render(`subscription`,{
    })
})

app.get(`/qa`, (req, res)=>{
    res.render(`qa`,{
    })
})

app.get(`/help`, (req, res)=>{
    res.render(`help`,{
    })
})

app.get(`/contacts`, (req, res)=>{
    res.render(`contacts`,{
    })
})

app.get(`/pets`, (req, res)=>{
    let sex = req.query.sex
    let status = req.query.status
    if (!sex && !status) {
        res.render(`pets`,{
            cats: cats
        })
    }
    else {
        let search = [];
        for (let i = 0; i < cats.length; i++) {
            let item = cats[i];
            if (item.sex == sex && ((status == 'home' && item.adopted == true) || (status == 'free' && item.adopted == false))) {
                search.push(item);
            }
        }
        res.render(`pets`, {cats: search})
    }
})

app.get(`/wantCat`, (req, res)=>{
    let id = req.query.index
    if (cats[id]) {
        cats[id].wanted = true
    }
    res.redirect(`/pets`);
})

app.get(`/commentCat`, (req, res)=>{
    let id = req.query.index
    let cat = cats[0];
    if (cats[id]) {
        cat = cats[id]
    }
    res.render(`commentsUser`, {cat: cat});
})

app.get(`/adoptCat`, (req, res)=>{
    let id = req.query.id
    if (cats[id]) {
        cats[id].adopted = true
        cats[id].wanted = false
    }
    res.redirect(`/admin`);
})

app.use(function(req, res, next) {
    res.status(404).render('404');
}); 
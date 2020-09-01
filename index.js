const express = require("express");
const app = express();
const morgan = require("morgan");

let persons = [
  {
    id: 1,
    name: "Hanusha",
    number: "9984789321",
  },
  {
    id: 2,
    name: "Geetha",
    number: "8974789321",
  },
  {
    id: 3,
    name: "Rajalakshmi",
    number: "9486213192",
  },
];

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phone book has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/person/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);
  if (!person) return res.status(404).end();
  res.json(person);
});

app.delete("/api/person/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((n) => n.id !== id);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  let person = req.body;

  if (!person.name && !person.number)
    return res.status(400).json({ error: "Name or number is required" });

  person = persons.find(
    (p) => p.name.toLowerCase() === person.name.toLowerCase()
  );

  if (person) return res.status(400).json({ error: "name must be unique" });
  const { name, number } = req.body;

  const id = persons[persons.length - 1].id + 1;

  person = { name, number, id };

  persons = [...persons, person];
  res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const pages = [
    { paths: ['/',], view: 'pages/index' },
    { paths: ['/offer-suivies.html'], view: 'pages/offer-suivies' },
    { paths: ['/deposer-offer.html'], view: 'pages/deposer-offer' },
    { paths: ['/administration.html'], view: 'pages/administration' },
    { paths: ['/offer-details.html'], view: 'pages/offer-detail' },
];

pages.forEach(({ paths, view }) => {
    app.get(paths, (req, res) => res.render(view));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
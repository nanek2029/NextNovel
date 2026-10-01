import type { Book } from './BookCard';
import one from "../assets/dummyPhotos/intothewild.webp";
import two from "../assets/dummyPhotos/fireandice.webp";
import three from "../assets/dummyPhotos/forestofsecrets.webp";
import four from "../assets/dummyPhotos/risingstorm.webp";
import five from "../assets/dummyPhotos/adangerouspath.webp";
import six from "../assets/dummyPhotos/thedarkesthour.webp";

// dummy book data with photos for testing purposes 


export const dummyBookData: Book[] = [
    {
        id: 'warriors-1',
        title: 'Into the Wild',
        author: 'Erin Hunter',
        genre: 'Fantasy',
        year: 2003,
        thumbnail:one,
        status: 'want to read',
        length: 272,
    },

    {
        id: 'warriors-2',
        title: 'Fire and Ice',
        author: 'Erin Hunter',
        genre: 'Fantasy',
        year: 2003,
        thumbnail: two,
        status: 'want to read',
        length: 317,
    },

    {
        id: 'warriors-3',
        title: 'Forest of Secrets',
        author: 'Erin Hunter',
        genre: 'Fantasy',
        year: 2003,
        thumbnail: three,
        status: 'want to read',
        length: 312,
    },

    {
        id: 'warriors-4',
        title: 'Rising Storm',
        author: 'Erin Hunter',
        genre: 'Fantasy',
        year: 2004,
        thumbnail: four,
        status: 'want to read',
        length: 315,
    },

    {
        id: 'warriors-5',
        title: 'A Dangerous Path',
        author: 'Erin Hunter',
        genre: 'Fantasy',
        year: 2004,
        thumbnail:five,
        status: 'want to read',
        length: 313,
    },

    {
        id: 'warriors-6',
        title: 'The Darkest Hour',
        author: 'Erin Hunter',
        genre: 'Fantasy',
        year: 2004,
        thumbnail:six,
        status: 'want to read',
        length: 315,
    },
];
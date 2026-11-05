import { Flex, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import MultiSelect from '../secondary/MultiSelect';
import NumberRange from '../secondary/NumberRange';
import { useState } from 'react';

// This file contains the questionnaire page where users can fill out their preferences to get a recommendation

// REPLACE LATER WITH THOSE IN GOOGLE BOOKS API DATABASE 
const genres = [
    'Fantasy',
    'Science Fiction',
    'Mystery',
    'Romance',
    'Thriller'
];

export default function Questionnaire() {

    // variables for page count and operator for number range
    const [operator, setOperator] = useState<string>('>');
    const [numberValue, setNumberValue] = useState<number | string>('');

    // variables for  year range
    const [operator2, setOperator2] = useState<string>('>');
    const [numberValue2, setNumberValue2] = useState<number | string>('');

    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        setErrorMessage(null);

        // must pick at least one genre 
        if (selectedGenres.length === 0) {
            setErrorMessage('Please select at least one genre.');
            return;
        }

        // must pick page count and operator
        if (numberValue === '' || numberValue === null || numberValue === undefined) {
            setErrorMessage('Please select a page count.');
            return;
        }

        if (operator === '') {
            setErrorMessage('Please select greater/less than for page count.');
            return;
        }

        // must pick year and year operator
        if (numberValue2 === '' || numberValue2 === null || numberValue2 === undefined) {
            setErrorMessage('Please select a publication year.');
            return;
        }

        if (operator2 === '') {
            setErrorMessage('Please select before/after for publication year.');
            return;
        }

        // assemble query
        const answers: {
            genres: string[];
            pageCount?: { operator: string; value: number | string };
            publicationYear?: { operator: string; value: number | string };
        } = {
            genres: selectedGenres,
            pageCount : { operator: operator, value: numberValue },
            publicationYear : { operator: operator2, value: numberValue2 }
        };

        // api call 
        try {
            const response = await fetch(`/api/books/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(answers)
            });
        } catch (error) {
            console.error("Error submitting questionnaire:", error);
        }
    };

    return (
        <Flex bg="#FFFEF6" direction="row" style={{ width: '100%', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

            {/* content of page */}
            <Flex direction="column" align="center" justify="center" style={{ flex: 1, height: '100%', padding: '2rem' }}>
                <Title c="#3A5B22" mb="xl" order={1}>Describe your dream book</Title>

                {/* form card */}
                <Flex bg="#FFFFFF" align="center" direction="column" gap="lg" style={{ border: '1px solid #d1dfce', borderRadius: 'var(--mantine-radius-lg)', padding: '3rem', width: '85%', flexWrap: 'wrap' }}>

                    {/* error message display*/}
                    {errorMessage && (
                        <Text c="red" size="sm" fw={500}>
                            {errorMessage}
                        </Text>
                    )}

                    <Flex direction="row" gap="md" style={{ flex: 1, minWidth: 0 }}>
                        
                        {/* genre selection */}
                        <Flex direction="column" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                            <Text c="#637a4e" fw={500} size="md">1. What genres would you prefer to read?</Text>
                            <MultiSelect optionsList={genres} selectedValues={selectedGenres} onChange={setSelectedGenres} placeholder="Select one or more genres..." />
                        </Flex>

                        {/* page length selection */}
                        <Flex direction="column" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                            <Text c="#637a4e" fw={500} size="md">2. How many pages do you want to read?</Text>
                            <NumberRange type="pages" operatorValue={operator} onOperatorChange={setOperator} value={numberValue} onChange={setNumberValue} />
                        </Flex>

                        {/* year published selection */}
                        <Flex direction="column" gap="sm" style={{ flex: 1, minWidth: 0 }}>
                            <Text c="#637a4e" fw={500} size="md">3. What year should the book be from?</Text>
                            <NumberRange type="years" operatorValue={operator2} onOperatorChange={setOperator2} value={numberValue2} onChange={setNumberValue2} />
                        </Flex>

                    </Flex>

                    <Button mt="lg" onClick={handleSubmit}  color="#3A5B22" mb={0} style={{height: "50px", width: '40%', fontSize: 'var(--mantine-font-size-lg'}} >Find my NextNovel</Button>

                </Flex>

            </Flex>


        </Flex>
    );
}
import { Button, Flex, Title, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import homePic from '../assets/home_pic.jpg';
import '../secondary/Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* Section with title and photo */}
      <Flex className="intro-section">
        <div
          className="intro-image"
          style={{
            backgroundImage: `url(${homePic})`,
          }}
        />

        <div className="intro-pic-overlay" />

        <Flex
          className="intro-content"
          direction="column"
          align="center"
        >
          <Title className="title">
            <span>N</span>
            <span>e</span>
            <span>x</span>
            <span>t</span>
            <span>N</span>
            <span>o</span>
            <span>v</span>
            <span>e</span>
            <span>l</span>
          </Title>

          <Text className="intro-subtitle">
            Your new favorite book website.
          </Text>

          <a
            href="#get-started"
            className="intro-scroll"
          >
            Get started ↓
          </a>

        </Flex>
      </Flex>

      {/* Section with link to buttons */}
      <Flex
        id="get-started"
        className="get-started"
      >
        <Flex
          className="get-started-content"
          direction="column"
          align="center"
        >
          <Title className="get-started-title">
            Find your next favorite book.
          </Title>

          <Text className="get-started-subtitle">
            Track the books you're reading, build your bookshelf,
            and discover your next novel.
          </Text>

          <Flex className="get-started-buttons">
            <Button
              className="get-started-button"
              color="#3A5B22"
              c="#FFFEF6"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>

            <Button
              className="get-started-button"
              color="#3A5B22"
              c="#FFFEF6"
              size="lg"
              onClick={() => navigate('/bookshelf')}
            >
              Start Tracking
            </Button>

            <Button
              className="get-started-button"
              color="#3A5B22"
              c="#FFFEF6"
              size="lg"
              onClick={() => navigate('/recommendation')}
            >
              Find Your Next Novel
            </Button>

          </Flex>
        </Flex>
      </Flex>

    </div>
  );
}

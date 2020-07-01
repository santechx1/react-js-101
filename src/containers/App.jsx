import React from 'react';
import Header from '../components/Header';
import Search from '../components/Search';
import Categories from '../components/Categories';
import Carousel from '../components/Carousel';
import CarouselItem from '../components/CarouselItem';
import Footer from '../components/Footer';
import '../assets/styles/App.scss';
import useInitialState from '../hooks/useInitialState';

const API = 'http://127.0.0.1:3001/initalState';

const App = () => {
    const initialState = useInitialState(API);

    return initialState.length === 0 ? <h1>Loading...</h1> : (
        <div className="App">
            <Header />
            <Search />
            {
                initialState.mylist.length > 0 &&
                <Categories title={k}>
                    <Carousel>
                        {
                            initialState.mylist.map(item =>
                                <CarouselItem key={item.id} {...item} />
                            )
                        }
                    </Carousel>
                </Categories>

            }

            <Categories title="Trends">
                <Carousel>
                    {
                        initialState.trends.map(item =>
                            <CarouselItem key={item.id} {...item} />
                        )
                    }
                </Carousel>
            </Categories>
            <Categories title="Platzi Video Originals">
                <Carousel>
                    {
                        initialState.originals.map(item =>
                            <CarouselItem key={item.id} {...item} />
                        )
                    }
                </Carousel>
            </Categories>
            <Footer />
        </div>
    );
}

export default App;
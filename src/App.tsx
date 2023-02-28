import { faker } from '@faker-js/faker';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useEffect, useState } from 'react';
import seedrandom from 'seedrandom';
import './App.scss';
import { similarity } from './utils';

export const App = () => {
    const [fakerCouple, setFakerCouple] = useState(['', ''] as [
        string,
        string
    ]);
    const [time, setTime] = useState(Date.now());
    const [couple, setCouple] = useState(['', ''] as [string, string]);
    const [matchPercentage, setMatchPercentage] = useState(
        undefined as number | undefined
    );
    const [animationParent] = useAutoAnimate({
        easing: 'ease-in-out',
        duration: 300,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('='.repeat(20));
        setTime(Date.now());

        const newCouple = [...couple].map((c) => c.toLowerCase()).sort((a, b) => a.localeCompare(b)) as typeof couple;
        const seed = newCouple.join('');
        const seeded = Math.round(seedrandom(seed)() * 90);
        let match = seeded;
        console.log('Seeded', match);

        const simExtra = Math.round(seedrandom(seed)() * 10 + 2);
        const sim = Math.round(similarity(...newCouple) * 10) + simExtra;
        console.log('Similarity', sim, `(+${simExtra})`);

        match = match + sim;
        console.log('+=', match);

        const simBonus = Math.round((match * (sim / 2)) / 100);
        console.log('Similarity bonus', '+' + simBonus, `(+${sim / 2}%)`);

        match += simBonus;

        console.log('no-cap', match);
        match = Math.min(match, 100);
        console.log('Final', match);

        setMatchPercentage(match);

        return false;
    };

    const handleCoupleChange = (index: number, value: string) =>
        setCouple((prevCouple) => {
            const newCouple = [...prevCouple] as typeof prevCouple;
            newCouple[index] = value;
            return newCouple;
        });

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        const mouseX = e.pageX;
        const mouseY = e.pageY;

        const elms = document.querySelectorAll('.relative-mouse');
        elms.forEach((elm) => {
            const rect = elm.getBoundingClientRect();
            const posX = mouseX - rect.left - window.scrollX;
            const posY = mouseY - rect.top - window.scrollY;
            (elm as HTMLElement).style.setProperty(
                '--pos',
                `${posX}px ${posY}px`
            );
        });
    };

    useEffect(() => {
        setFakerCouple([
            faker.name.firstName('male'),
            faker.name.firstName('female'),
        ]);
    }, []);

    return (
        <div
            className='wrapper'
            onMouseMove={handleMouseMove}
            ref={animationParent}
        >
            <div className='container noise'>
                <h3 style={{ marginTop: 0 }}>
                    <span>Couple matcher</span>
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className='fluent-border relative-mouse'>
                        <input
                            type='text'
                            value={couple[0]}
                            placeholder={fakerCouple[0]}
                            required
                            onChange={(event) =>
                                handleCoupleChange(0, event.target.value)
                            }
                        />
                    </div>
                    <center style={{ marginBottom: 4 }}>♥</center>
                    <div className='fluent-border relative-mouse'>
                        <input
                            type='text'
                            value={couple[1]}
                            placeholder={fakerCouple[1]}
                            required
                            onChange={(event) =>
                                handleCoupleChange(1, event.target.value)
                            }
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <div className='fluent-border relative-mouse'>
                            <input className='' type='submit' value='Check' />
                        </div>
                    </div>
                </form>
            </div>
            {matchPercentage !== undefined && (
                <div
                    className='container fluent-border relative-mouse'
                    style={{ padding: 2 }}
                >
                    <div
                        className='noise'
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(10,10,10)',
                            height: 100,
                            width: 100,
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    fontSize: 24,
                                    animation: 'pop .4s linear forwards',
                                }}
                                key={time}
                            >
                                {matchPercentage}%
                            </div>
                            <div>
                                match{' '}
                                <span
                                    key={time}
                                    style={{
                                        animation: 'cs 1s linear forwards',
                                    }}
                                >
                                    ♥
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;

export interface TML {
    original: string,
    time: string,
    trajectory: number,
    speed: number,
    location: number[]
}

export const tml = {
    parse: (text: string): TML | null => {
        const newText = text.split(/\n/);
        const index = newText.findIndex(element => element.includes('TIME...MOT...LOC'))
        if (index === -1) {
            // console.error('No correctly formatted TIME...MOT...LOC')
            return null
        }
        const original = newText[index].slice(17, newText[index].length)
        let data = newText[index].split(' ');
        data.shift()
        let time = data[0].split('')
        time.pop()

        return {
            original,
            time: `${time[0] + time[1]}:${time[2] + time[3]}`,
            trajectory: Number(data[1].slice(0,3)),
            speed: Number(data[2].slice(0,2)),
            location: [Number(data[3])/100, Number(data[4])/100]
        }
    }
}
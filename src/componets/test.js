export default function(arg) {
    console.log('333');

    alert(arg);

    [3, 4, 5].forEach((item, index) => {
        console.info(index, ':', item);
    })
}
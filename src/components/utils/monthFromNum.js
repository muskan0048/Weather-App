var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function stringDate(date){
    return new Date(date).getDate() +" "+ monthNames[new Date(date).getMonth()]
}
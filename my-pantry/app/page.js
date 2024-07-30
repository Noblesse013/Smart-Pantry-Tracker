import{ Box, Stack, Typography } from "@mui/material"

const item=['carrot','tomato','green-chili','brinjal','ladies finger','potato','onion','cucumber','honey',]
export default function Home() {
  return (
   <Box
      height="120vh"
      width="100vw"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
    >
    <Box marginBottom={1} width="500px" height="100px" bgcolor={"lightblue"}  border={"20px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
    <Typography 
              variant={"h4"}
              color={"White"}
              textAlign={"center"}
              fontWeight={"bold"}>
      Pantry Tracker
     </Typography>
   
      </Box> 
      <Stack width="500px" height="350px" spacing={1} overflow={'auto'} border={'1px solid grey'}>

        {item.map((i) => (
          <Box
            key={item}
            width="100%"
            height="100px"
            bgcolor={"lightpink"}
            borderRadius={"5px 5px 10px 10px"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography 
              variant={"h5"}
              color={"white"}
              textAlign={"center"}
              fontWeight={"bold"}
        
            
            > 
              {i.charAt(0).toUpperCase() + i.slice(1)}
            </Typography>
          </Box>  
        ))}</Stack>
    </Box>


  )
}

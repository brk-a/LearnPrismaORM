import express, {Request, Response} from "express"
import {PrismaClient} from "@prisma/client"

const app = express()
const prisma = new PrismaClient()
const port = process.env.PORT

//currency is json
app.use(express.json())

/**endpoints for CRUD */
    //create one
app.post("/createUser", async(req: Request, res: Response) => {
    const {username, password} = req.body
    const user = await prisma.users.create({
        data: {
            username,
            password
        },
    })
    res.status(200).json(user)
})
    //create many
app.post("/createManyUsers", async(req: Request, res: Response) => {
    const {userList} = req.body
    const users = await prisma.users.createMany({
        data: userList,
    })
    res.status(200).json(users)
})
app.post("/createManyCars", async(req: Request, res: Response) => {
    const {carList} = req.body
    const cars = await prisma.cars.createMany({
        data: carList,
    })
    res.status(200).json(cars)
})
    //read all
app.get("/readUsers", async(req: Request, res: Response) => {
    const users = await prisma.users.findMany()
    res.status(200).json(users)
})
    //read all; include cars
app.get("/readUsers", async(req: Request, res: Response) => {
    const users = await prisma.users.findMany({
        include: {cars: true},
    })
    res.status(200).json(users)
})
    //read one
app.get("/byId/:id", async(req: Request, res: Response) => {
    const {id} = req.params
    const user = await prisma.users.findUnique({
        where: {
            id: Number(id)
        }
    })
})
    //update
app.put("/updateUser", async(req: Request, res: Response) => {
    const {id, password} = req.body
    const updatedUser = await prisma.users.update({
        where: {id},
        data: {password}
    })
    res.status(200).json(updatedUser)
})
    //delete
app.delete("/:id", async(req: Request, res: Response) => {
    const {id} = req.params
    const deletedUser = await prisma.users.delete({
        where: {
            id: Number(id)
        },
    })
    res.status(200).json(deletedUser)
})

/**listen out for server */
app.listen(port, () => {
    console.log("Server running")    
})
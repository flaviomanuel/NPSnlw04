import request from 'supertest'
import createConnection from "../database";
import { app } from '../app';
import { getConnection } from 'typeorm';


describe("Users", async() =>{
	beforeAll(async () =>{
		const connection = await createConnection();
		await connection.runMigrations();
	})

	afterAll(async () => {
		const connection = getConnection();
		await connection.dropDatabase()
		await connection.close();
	})

	it("Should be able to create a new user", async () => {
		const response = await request(app).post("/users")
		.send({
			email: "jailson@example.com",
			name: "jailsonExample"
		})
		
		expect(response.status).toBe(201);
	})

    it("shoudl not be able to create a user with exists email", async () => {
        const response = await request(app).post("/users")
		.send({
			email: "jailson@example.com",
			name: "jailsonExample"
		})
		
		expect(response.status).toBe(400);
    })
})
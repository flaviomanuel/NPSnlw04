import request from 'supertest';
import createConnection from "../database";
import { app } from '../app';
import { getConnection } from 'typeorm';

describe("Surveys", async() =>{
	beforeAll(async () =>{
		const connection = await createConnection();
		await connection.runMigrations();
	})

	afterAll(async () => {
		const connection = getConnection();
		await connection.dropDatabase()
		await connection.close();
	})

	it("Should be able to create a new survey", async () => {
		const response = await request(app) // possibilita realizar uma requisição com 
		.post("/surveys")
		.send({
			title: "title example",
			description: "description example"
		})
		
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
	})

    it("Shoud be able to get all surveys", async () => {
        await request(app).post("/surveys")
		.send({
			title: "title example",
			description: "description example"
		})
		
        const response = await request(app).get('/surveys');

        expect(response.body.length).toBeLessThan(1000)
    })
})
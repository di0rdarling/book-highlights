import express from 'express';
import Entity from '../models/entity';

export const entityRouter = express.Router();

entityRouter.post("/entity", async (request, response) => {
    await new Entity(request.body)
        .save()
        .then((entity) => {
            response.sendStatus(201);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

entityRouter.get("/entities", async (request, response) => {
    await Entity.find({})
        .then((entities) => {
            response.status(200).send(entities);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

entityRouter.get("/entity/:_id", async (request, response) => {
    await Entity.findById(request.params._id)
        .exec()
        .then((entity) => {
            response.status(200).send(entity);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

entityRouter.put("/entity/:_id", async (request, response) => {
    await Entity.findByIdAndUpdate(request.params._id, request, {
        new: true,
    })
        .then((projectEdit) => {
            response.status(200).send(projectEdit);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

entityRouter.delete("/entity/:_id", async (request, response) => {
    await Entity.findByIdAndRemove(request.params._id)
        .then((res) => {
            response.sendStatus(200);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

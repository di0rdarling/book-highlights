import express from 'express';
import Highlight from '../models/highlight';
import HighlightCreate from '../models/highlightCreate';

export const highlightRouter = express.Router();

highlightRouter.post("/highlight", async (request, response) => {
    await new HighlightCreate(request.body)
        .save()
        .then((highlight) => {
            response.sendStatus(201);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

highlightRouter.get("/highlights", async (request, response) => {
    await Highlight.find({})
        .then((highlights) => {
            response.status(200).send(highlights);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

highlightRouter.get("/highlight/:_id", async (request, response) => {
    await Highlight.findById(request.params._id)
        .exec()
        .then((highlight) => {
            response.status(200).send(highlight);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

highlightRouter.put("/highlight/:_id", async (request, response) => {
    await Highlight.findByIdAndUpdate(request.params._id, request, {
        new: true,
    })
        .then((projectEdit) => {
            response.status(200).send(projectEdit);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

highlightRouter.delete("/highlight/delete/:_id", async (request, response) => {
    await Highlight.findByIdAndRemove(request.params._id)
        .then((res) => {
            response.sendStatus(200);
        })
        .catch((err) => {
            response.status(500).send(err);
        });
});

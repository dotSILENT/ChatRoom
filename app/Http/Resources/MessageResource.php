<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;
use App\Http\Resources\UserResource;

class MessageResource extends Resource
{
    /**
     * Transform the resource collection into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'message' => $this->content,
            'created_at' => $this->created_at->toDateTimeString(),
            'user' => new UserResource($this->user)
        ];
    }
}

Hooks.on("renderItemSheetWfrp4e", (sheet, html, data) => {
    if (data.item.type == "spell" || data.item.type == "prayer")
    {
      let currentMacroText = data.item.flags["wfrp-macros"] || "";
      let actorId = ""
      if (sheet.item.actor)
        actorId = sheet.item.actor.id
      let macroInput = $(`
      <div class="form-group" data-actor-id="${actorId}" data-item-id="${sheet.item.id}">
        <label class="label-text skills-textarea">Macro</label>
        <div class="input-box skills-textarea">
          <textarea class="input-text" type="text" data-dtype="String">${currentMacroText}</textarea>
        </div>
      </div>`)
      macroInput.find("textarea").on("change", function(event, sheet) {
        let actorId = $(event.currentTarget).parents(".form-group").attr("data-actor-id")
        let itemId = $(event.currentTarget).parents(".form-group").attr("data-item-id")

        if (actorId)
        {
          game.actors.get(actorId).updateEmbeddedEntity("OwnedItem", {_id : itemId, "flags.wfrp-macros" : event.currentTarget.value})
        }
        else if (itemId)
        {
          game.items.get(itemId).update({"flags.wfrp-macros" : event.currentTarget.value})
        }
      })
      html.find(".details").append(macroInput)
    }
} )

Hooks.on("wfrp4e:rollCastTest", result => {
  let macroText = result.spell.flags["wfrp-macros"];

  let macro = new Macro({type : "script", author: game.user.id, name : result.spell.name, command : macroText})
  macro.execute()
})

Hooks.on("wfrp4e:rollPrayerTest", result => {
  let macroText = result.prayer.flags["wfrp-macros"];

  let macro = new Macro({type : "script", author: game.user.id, name : result.prayer.name, command : macroText})
  macro.execute()
})